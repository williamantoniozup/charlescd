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

import { Story } from '@storybook/react';
import CardConfig, {
  Props as CardConfigProps,
} from 'core/components/Card/Config';
import CardExpand from 'core/components/Card/Expand';
import CardBody from 'core/components/Card/Body';
import { useState } from 'react';

export default {
  title: 'Components/Cards/Expand',
  component: CardExpand,
};

const Template: Story<CardConfigProps> = (props: CardConfigProps) => {
  const [toggle, setToggle] = useState(false);
  return (
    <CardConfig {...props}>
      <CardBody onClick={() => setToggle(true)}>click here</CardBody>
      {toggle && (
        <CardExpand onClick={() => setToggle(false)}>expand content</CardExpand>
      )}
    </CardConfig>
  );
};

export const expand = Template.bind({});
expand.args = {};
expand.parameters = {
  docs: {
    source: {
      type: 'code',
    },
  },
};
