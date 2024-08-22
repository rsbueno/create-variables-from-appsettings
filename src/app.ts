import fs from 'fs'
import 'dotenv/config'
import { Json2Variable } from './json2variable';
import { Variable } from './variable';
import { AzureDevopsClient } from './azureDevopsClient';

async function main() {
    const fileContent = await fs.promises.readFile(process.env.APPSETTINGS_PATH, 'utf-8');
    const jsonSettings = JSON.parse(fileContent);

    const ignoredPropertiesPattern = process.env.IGNORED_PROPERTIES_PATTERN.length > 0 ? process.env.IGNORED_PROPERTIES_PATTERN.split(',') : [];
    const secretPropertiesPattern = process.env.SECRET_PROPERTIES_PATTERN.length > 0 ? process.env.SECRET_PROPERTIES_PATTERN.split(',') : [];

    const converter = new Json2Variable(ignoredPropertiesPattern, secretPropertiesPattern);
    const variables = converter.convert(jsonSettings);

    if (variables.length === 0) {
        console.error("Não foram encontradas variáveis no arquivo json.");
        return;
    }

    writeLog(variables);

    if (process.env.DRY_RUN === "true") {
        console.warn("Pipeline não alterado porque está o modo de execução está configurado como teste (DRY_RUN=true).");
    } else {
        try {
            var azClient = new AzureDevopsClient(process.env.AZURE_DEVOPS_URL, process.env.PAT, process.env.AZURE_PROJECT);
            await azClient.CreateOrUpdateVariables(parseInt(process.env.RELEASE_DEFINITION_ID), process.env.STAGE, variables);
            console.info("Processo concluído com sucesso!")
        } catch (error) {
            console.error(error.message);
        }
    }
}

function writeLog(variables: Variable[]) {
    const common = variables.filter(v => !v.secret);
    const secrets = variables.filter(v => v.secret);

    console.log("---- Todas as variáveis encontradas ----");
    variables.forEach(variable => {
        console.log(`   ${variable.name}=${variable.secret ? "***" : variable.value}`)
    });
    console.log("-----------------------------------------");
    console.log();

    console.log("---- Variáveis do tipo comum ----");
    common.forEach(variable => {
        console.log(`   ${variable.name}`)
    });
    console.log("-----------------------------------------");
    console.log();

    console.log("---- Variáveis do tipo secret ----");
    secrets.forEach(variable => {
        console.log(`   ${variable.name}`)
    });
    console.log("-----------------------------------------");
}

main();