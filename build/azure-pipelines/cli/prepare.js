"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const getVersion_1 = require("../../lib/getVersion");
const fs = require("fs");
const path = require("path");
const packageJson = require("../../../package.json");
const root = path.dirname(path.dirname(path.dirname(__dirname)));
const readJSON = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
let productJsonPath;
const isOSS = process.env.VSCODE_QUALITY === 'oss' || !process.env.VSCODE_QUALITY;
if (isOSS) {
    productJsonPath = path.join(root, 'product.json');
}
else {
    productJsonPath = path.join(root, 'quality', process.env.VSCODE_QUALITY, 'product.json');
}
console.log('Loading product.json from', productJsonPath);
const product = readJSON(productJsonPath);
const allProductsAndQualities = isOSS ? [product] : fs.readdirSync(path.join(root, 'quality'))
    .map(quality => ({ quality, json: readJSON(path.join(root, 'quality', quality, 'product.json')) }));
const commit = (0, getVersion_1.getVersion)(root);
const makeQualityMap = (m) => {
    const output = {};
    for (const { quality, json } of allProductsAndQualities) {
        output[quality] = m(json, quality);
    }
    return output;
};
/**
 * Sets build environment variables for the CLI for current contextual info.
 */
const setLauncherEnvironmentVars = () => {
    const vars = new Map([
        ['VSCODE_CLI_REMOTE_LICENSE_TEXT', product.serverLicense?.join('\\n')],
        ['VSCODE_CLI_REMOTE_LICENSE_PROMPT', product.serverLicensePrompt],
        ['VSCODE_CLI_AI_KEY', product.aiConfig?.cliKey],
        ['VSCODE_CLI_AI_ENDPOINT', product.aiConfig?.cliEndpoint],
        ['VSCODE_CLI_VERSION', packageJson.version],
        ['VSCODE_CLI_UPDATE_ENDPOINT', product.updateUrl],
        ['VSCODE_CLI_QUALITY', product.quality],
        ['VSCODE_CLI_NAME_SHORT', product.nameShort],
        ['VSCODE_CLI_NAME_LONG', product.nameLong],
        ['VSCODE_CLI_QUALITYLESS_PRODUCT_NAME', product.nameLong.replace(/ - [a-z]+$/i, '')],
        ['VSCODE_CLI_APPLICATION_NAME', product.applicationName],
        ['VSCODE_CLI_EDITOR_WEB_URL', product.tunnelApplicationConfig?.editorWebUrl],
        ['VSCODE_CLI_COMMIT', commit],
        [
            'VSCODE_CLI_WIN32_APP_IDS',
            !isOSS && JSON.stringify(makeQualityMap(json => Object.entries(json)
                .filter(([key]) => /^win32.*AppId$/.test(key))
                .map(([, value]) => String(value).replace(/[{}]/g, '')))),
        ],
        [
            'VSCODE_CLI_NAME_LONG_MAP',
            !isOSS && JSON.stringify(makeQualityMap(json => json.nameLong)),
        ],
        [
            'VSCODE_CLI_APPLICATION_NAME_MAP',
            !isOSS && JSON.stringify(makeQualityMap(json => json.applicationName)),
        ],
        [
            'VSCODE_CLI_SERVER_NAME_MAP',
            !isOSS && JSON.stringify(makeQualityMap(json => json.serverApplicationName)),
        ],
        [
            'VSCODE_CLI_QUALITY_DOWNLOAD_URIS',
            !isOSS && JSON.stringify(makeQualityMap(json => json.downloadUrl)),
        ],
    ]);
    console.log(JSON.stringify([...vars].reduce((obj, kv) => ({ ...obj, [kv[0]]: kv[1] }), {})));
    for (const [key, value] of vars) {
        if (value) {
            console.log(`##vso[task.setvariable variable=${key}]${value}`);
        }
    }
};
if (require.main === module) {
    setLauncherEnvironmentVars();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByZXBhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Z0dBR2dHOztBQUVoRyxxREFBa0Q7QUFDbEQseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxREFBcUQ7QUFFckQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFFN0UsSUFBSSxlQUF1QixDQUFDO0FBQzVCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xGLElBQUksS0FBSyxFQUFFO0lBQ1YsZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0NBQ2xEO0tBQU07SUFDTixlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0NBQzFGO0FBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUMxRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDMUMsTUFBTSx1QkFBdUIsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxD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