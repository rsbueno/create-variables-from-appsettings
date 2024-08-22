import * as azdev from "azure-devops-node-api";
import { Variable } from "./variable";

class AzureDevopsClient {
    private connection: azdev.WebApi;
    private project: string;

    constructor(url: string, accessToken: string, project: string) {
        let authHandler = azdev.getPersonalAccessTokenHandler(accessToken);
        this.connection = new azdev.WebApi(url, authHandler);
        this.project = project;
    }

    public async CreateOrUpdateVariables(releaseDefinitionId: number, stage: string, variables: Variable[]) {
        let releaseApi = await this.connection.getReleaseApi();
        var release = await releaseApi.getReleaseDefinition(this.project, releaseDefinitionId);

        var environments = release.environments
            ? release.environments.filter(f => f.name === stage) : [];

        if (environments.length === 0) {
            throw new Error(`Stage do pipeline não encontrado (STAGE=${stage})`);
        }

        var environment = environments[0];

        variables.forEach(variable => {
            const name = variable.name;
            const currentVariable = environment.variables[name];

            if(currentVariable) {
                currentVariable.value = variable.value;
                currentVariable.isSecret = variable.secret;
            } else {
                environment.variables[name] = { value: variable.value, isSecret: variable.secret };    
            }
        })

        await releaseApi.updateReleaseDefinition(release, this.project);
    }
}

export { AzureDevopsClient };