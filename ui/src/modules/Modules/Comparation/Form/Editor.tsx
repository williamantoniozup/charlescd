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

import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism.css";
import Styled from "./styled";
import Icon from "core/components/Icon";
// import { useYamlValues } from "modules/Modules/hooks/component";
import { codeYaml } from "./constants";

interface Props {
  onChange: (code: string) => void;
}

const YamlEditor = ({ onChange }: Props) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [code, setCode] = useState(codeYaml);
  // const { yamlValues, loadYamlValues, loadingYaml} = useYamlValues()

  // useEffect(() => {
  //   loadYamlValues()
  // }, [])

  return (
    <Styled.Editor.YamlEditorWrapper fullScreen={fullScreen}>
      <Styled.Editor.FullscreenButton
        onClick={() => setFullScreen(!fullScreen)}
      >
        <Icon name="maximize" />
      </Styled.Editor.FullscreenButton>
      <Editor
        value={code}
        onValueChange={code => {
          setCode(code)
          onChange(code)
        }}
        highlight={code => highlight(code, languages.yaml, "language-yaml")}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          color: "white",
          opacity: 1,
          backgroundColor: "#2C2C2E",
          width: "100%",
          height:"100%",
          overflow: "scroll"
        }}
      />
    </Styled.Editor.YamlEditorWrapper>
  );
};

export default YamlEditor;
