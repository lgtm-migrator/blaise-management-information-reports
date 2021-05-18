export interface EnvironmentVariables {
    PROJECT_ID: string
    ENV_NAME: string
    GIT_BRANCH: string
}

export function getEnvironmentVariables(): EnvironmentVariables {
    let {PROJECT_ID, ENV_NAME, GIT_BRANCH} = process.env;

    if (PROJECT_ID === undefined) {
        console.error("PROJECT_ID environment variable has not been set");
        PROJECT_ID = "ENV_VAR_NOT_SET";
    }

    if (ENV_NAME === undefined) {
        console.error("ENV_NAME environment variable has not been set");
        ENV_NAME = "ENV_VAR_NOT_SET";
    }

    if (GIT_BRANCH === undefined) {
        console.error("GIT_BRANCH environment variable has not been set");
        GIT_BRANCH = "ENV_VAR_NOT_SET";
    }

    return {PROJECT_ID, ENV_NAME, GIT_BRANCH};
}
