export interface EnvironmentVariables {
    PROJECT_ID: string
    BERT_URL: string
}

export function getEnvironmentVariables(): EnvironmentVariables {
    let {PROJECT_ID, BERT_URL} = process.env;

    if (PROJECT_ID === undefined) {
        console.error("PROJECT_ID environment variable has not been set");
        PROJECT_ID = "ENV_VAR_NOT_SET";
    }

    if (BERT_URL === undefined) {
        console.error("BERT_URL environment variable has not been set");
        BERT_URL = "ENV_VAR_NOT_SET";
    }

    return {PROJECT_ID, BERT_URL};
}
