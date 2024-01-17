/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { defineCliConfig } from 'sanity/cli';
import * as dotenv from 'dotenv';
import { join } from 'path';
import process from 'process';

import tsconfig from './tsconfig.json';

dotenv.config();

// Get the aliases from tsconfig
const aliases = Object.entries(tsconfig.compilerOptions.paths).map(
  ([key, value]) => ({
    find: key.replace(/\/\*$/, ''),
    replacement: join(__dirname, value[0]).replace(/\/\*$/, ''),
  }),
);

const target = process.env.TARGET;

let dataset = process.env.SANITY_STUDIO_PROD_DATASET;

if (target === 'dev') {
  dataset = process.env.SANITY_STUDIO_DEV_DATASET;
}

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT,
    dataset,
  },

  vite(config) {
    return Object.assign(config, {
      resolve: {
        alias: aliases,
      },
    });
  },
});
