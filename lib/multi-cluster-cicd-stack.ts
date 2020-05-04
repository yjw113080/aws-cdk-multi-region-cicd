import * as cdk from '@aws-cdk/core';
import codecommit = require('@aws-cdk/aws-codecommit');
import ecr = require('@aws-cdk/aws-ecr');
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import pipelineAction = require('@aws-cdk/aws-codepipeline-actions');
import * as iam from '@aws-cdk/aws-iam';

export class MultiClusterCicdStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repoForCDK = new codecommit.Repository(this, 'cdk-repo', {
      repositoryName: 'cdk-repo'
    });
    
    const roleToAssume = new iam.Role(this, `role-to-assume`, {
      assumedBy: new iam.AccountRootPrincipal()
    });
    roleToAssume.addToPolicy(new iam.PolicyStatement({ actions: [`*`], resources: [`*`]}));

    const deployCDK = new codebuild.PipelineProject(this, 'build-for-cdk', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
        privileged: true
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
            pre_build: {
              commands: [`npm i -g aws-cdk`, `npm i`, `npm run-script build`]
            },
            build: {
              commands: [
                `CREDENTIALS=$(aws sts assume-role --role-arn "${roleToAssume.roleArn}" --role-session-name codebuild-cdk)`,
                `export AWS_ACCESS_KEY_ID="$(echo \${CREDENTIALS} | jq -r '.Credentials.AccessKeyId')"`,
                `export AWS_SECRET_ACCESS_KEY="$(echo \${CREDENTIALS} | jq -r '.Credentials.SecretAccessKey')"`,
                `export AWS_SESSION_TOKEN="$(echo \${CREDENTIALS} | jq -r '.Credentials.SessionToken')"`,
                `export AWS_EXPIRATION=$(echo \${CREDENTIALS} | jq -r '.Credentials.Expiration')`,
                `cdk deploy '*' --require-approval never; done`
              ]
            }
          }
      })
    });

    deployCDK.addToRolePolicy(new iam.PolicyStatement({
      actions: [`sts:AssumeRole`],
      resources: [roleToAssume.roleArn]
    }));
    
    const sourceOutput = new codepipeline.Artifact();


    const pipelineForCDK = new codepipeline.Pipeline(this, 'pipeline-for-cdk', {
      stages: [
        {
          stageName: 'Source',
          actions: [ new pipelineAction.CodeCommitSourceAction({
            actionName: 'catch-the-cdk-code',
            repository: repoForCDK,
            output: sourceOutput
          },
        ) ]
        },
        {
          stageName: 'Deploy',
          actions: [ new pipelineAction.CodeBuildAction({
            actionName: 'deploy-CDK',
            input: sourceOutput,
            project: deployCDK
          }) ]
        }
      ]
    })


  }
}
