service: mir-ui
runtime: nodejs14

vpc_access_connector:
  name: projects/_PROJECT_ID/locations/europe-west2/connectors/vpcconnect

env_variables:
  PROJECT_ID: _PROJECT_ID
  BERT_URL: _BERT_URL
  BERT_CLIENT_ID: _BERT_CLIENT_ID

basic_scaling:
  idle_timeout: 1m
  max_instances: 1
