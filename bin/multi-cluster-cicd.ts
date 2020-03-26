#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MultiClusterCicdStack } from '../lib/multi-cluster-cicd-stack';

const app = new cdk.App();
new MultiClusterCicdStack(app, 'MultiClusterCicdStack', {
    env: { account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT, 
           region: 'ap-northeast-1' },
});
