service: mir-ui
runtime: nodejs14

vpc_access_connector:
  name: projects/_PROJECT_ID/locations/europe-west2/connectors/vpcconnect

env_variables:
  PROJECT_ID: _PROJECT_ID
  ENV_NAME: _ENV_NAME
  GIT_BRANCH: _GIT_BRANCH

basic_scaling:
  idle_timeout: 1m
  max_instances: 1

handlers:
- url: /.*
  script: auto
  secure: always
  redirect_http_response_code: 301
