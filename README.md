# Manage your EKS Cluster with CDK
This repository is part of *[Manage your EKS Cluster with CDK](http://demogo-multiregion-eks.s3-website.ap-northeast-2.amazonaws.com/ko/)* Hands-on Lab.

Please follow [this link](http://demogo-multiregion-eks.s3-website.ap-northeast-2.amazonaws.com/ko/) to play with the lab. :)

## CI/CD Pipeline for CDK deployment

As CDK team works on providing native CI/CD experience for CDK code, you can check this repo as a sample to deploy CDK code in a GitOps fashion.

This repository deploys any CDK project stored in CodeCommit to AWS cloud by CodeBuild, and the whole workflow is managed by AWS CodePipeline.

![](http://demogo-multiregion-eks.s3-website.ap-northeast-2.amazonaws.com/images/70-appendix/cdk-pipeline.svg)


## Related Repository
* [Skeleton Repository](https://github.com/yjw113080/aws-cdk-eks-multi-region-skeleton): You would clone this repository and build up the code as going through the steps in the lab.
* [Full-code Repository](https://github.com/yjw113080/aws-cdk-eks-multi-region): Once you complete the workshop, the code would look like this repository! You can also use this repository as a sample code to actually build CDK project for your own infrastructure and containers.
* [CI/CD for CDK](https://github.com/yjw113080/aws-cdk-multi-region-cicd): Fabulous CDK team is working on providing CI/CD natively, in the meantime, you can check out simple way to do it with AWS CodePipeline and CodeBuild.
* [Sample App for Multi-region Application Deployment](https://github.com/yjw113080/aws-cdk-multi-region-sample-app): In third lab of [this workshop](http://demogo-multiregion-eks.s3-website.ap-northeast-2.amazonaws.com/ko/), you will deploy your application in your developer's shoes. This repository holds the sample app to deploy. The sample simply says 'Hello World' with the information where it is hosted.





