import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import MultiClusterCicd = require('../lib/multi-cluster-cicd-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new MultiClusterCicd.MultiClusterCicdStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
