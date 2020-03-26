#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MultiClusterCicdStack } from '../lib/multi-cluster-cicd-stack';

const app = new cdk.App();
new MultiClusterCicdStack(app, 'MultiClusterCicdStack');
