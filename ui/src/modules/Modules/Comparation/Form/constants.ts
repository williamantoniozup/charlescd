/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Radio } from "core/components/RadioGroup";

export const component = {
  name: '',
  latencyThreshold: '',
  errorThreshold: '',
  templateMethod: '',
  helmLink: '',
  yamlValues: ''
};

export const radios: Radio[] = [
  { icon: '', name: 'Follow our guide', value: 'guide' },
  { icon: '', name: 'Custom', value: 'custom' },
  { icon: '', name: 'Advanced', value: 'advanced' }
];


export const codeYaml: string = `
replicaCount: 1
envVars:
  - name: SPRING_PROFILES_ACTIVE
    value: "k8s"
  - name: DB_URL
    value: "jdbc:postgresql://10.161.0.3:5432/charlescdmoove"
  - name: DB_USERNAME
    value: "charlesadmin"
  - name: DB_PASSWORD
    value: "firstpassword"
  - name: KEYCLOCK_REALM
    value: "charlescd"
  - name: KEYCLOAK_SERVER_URL
    value: "https://charles-dev.continuousplatform.com/keycloak/auth"
  - name: KEYCLOAK_CLIENT_ID
    value: "realm-charlescd"
  - name: KEYCLOAK_CLIENT_SECRET
    value: "a79e9316-2196-41d1-8dfe-98cc48241fe3"
  - name: ORIGIN_HOSTS
    value: "http://localhost:3000,http://localhost:3001,http://localhost:8081,http://localhost:8080,https://charles-dev.continuousplatform.com"
  - name: MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE
    value: '*'

image:
  tag: latest
service:
  name: darwin-application
  type: ClusterIP
  ports:
   - name: http
     port: 8080
configmaps:
  enabled: false
startcommand:
  enabled: false
  value: "[\"/bin/sh\",\"-c\",\"/usr/sbin/nginx -c /data/darwin-ui-nginx.conf\"]"
ingress:
  enabled: false
resources:
   limits:
    cpu: 1
    memory: 1536Mi
   requests:
    cpu: 128m
    memory: 128Mi
nodeSelector: {}
tolerations: []
affinity: {}
imageCredentials:
livenessProbe:
  enabled: true
  failureThreshold: 3
  httpGet:
    path: /actuator/health
    port: 8080
    scheme: HTTP
  initialDelaySeconds: 120
  periodSeconds: 20
  successThreshold: 1
  timeoutSeconds: 1
readinessProbe:
  failureThreshold: 3
  httpGet:
    path: /actuator/health
    port: 8080
    scheme: HTTP
  initialDelaySeconds: 120
  periodSeconds: 20
  successThreshold: 1
  timeoutSeconds: 1

consulnode:
  enabled: false

istio:
  enabled: true

vault:
  enabled: false
`
