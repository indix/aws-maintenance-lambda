#!/bin/bash

set -e

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIST_DIR="${CURRENT_DIR}/../../dist"
LAMBDA_DIR="${CURRENT_DIR}/../../lambda"

rm -rf "${DIST_DIR}"
mkdir "${DIST_DIR}"

pushd "${LAMBDA_DIR}"
rm -rf aws_maintenance_lambda-*.tgz package/
npm pack
tar xvf aws_maintenance_lambda-*.tgz

pushd package/
npm install --production
