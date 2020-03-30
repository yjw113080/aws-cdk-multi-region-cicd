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

    const sourceOutput = new codepipeline.Artifact();
    const buildForCDK = new codebuild.PipelineProject(this, 'build-for-cdk', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
        privileged: true
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
            pre_build: {
                commands: [ `npm i -g aws-cdk`, `npm i`, `npm run-script build` ]
            },
            build: {
              commands: [

                'export AWS_ACCESS_KEY_ID=AKIA4S4PRGWIASFYSC6G',
                'export AWS_SECRET_ACCESS_KEY=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',

                `for i in "$(cdk list)"; do cdk deploy $i --require-approval never; done`
                //`arr=($(cdk list | tr "\n" " "))`, 
                //'for i in "${arr[@]}"; do cdk deploy $i --require-approval never; done'
              ]
            }
          }
      })
    });
    buildForCDK.addToRolePolicy(new iam.PolicyStatement({
      actions: [`*`],
      resources: [`*`]
    }));

    const pipelineForCDK = new codepipeline.Pipeline(this, 'pipeline-for-cdk', {
      stages: [
        {
          stageName: 'source',
          actions: [ new pipelineAction.CodeCommitSourceAction({
            actionName: 'catch-the-cdk-code',
            repository: repoForCDK,
            output: sourceOutput
          },
        ) ]
        },{
          stageName: 'build-and-deploy',
          actions: [ new pipelineAction.CodeBuildAction({
            actionName: 'build-and-deploy-cdk',
            input: sourceOutput,
            project: buildForCDK
          }) ]
        }
      ]
    })

  }
}
