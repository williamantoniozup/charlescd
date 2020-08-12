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

import React, { useEffect, useState } from 'react';
import Text from 'core/components/Text';
import { useForm } from 'react-hook-form';
import Loader from '../Loaders/index';
import { normalizeCircleParams } from '../helpers';
import { useDeployMetric } from './hooks';
import deployOptions from './deploy.options';
import { periodFilterItems } from './constants';
import Styled from './styled';
import CircleFilter from './CircleFilter';
import ChartMenu from './ChartMenu';
import { getDeploySeries } from './helpers';
import { humanizeDateFromSeconds } from 'core/utils/date';
import ReleasesHistoryComponent from './Release';
import { ReleaseHistoryRequest } from './interfaces';
import Chart from 'react-google-charts';

const Deploys = () => {
  const { searchDeployMetrics, response, loading } = useDeployMetric();
  const { control, handleSubmit, getValues, setValue } = useForm();
  const deploySeries = getDeploySeries(response);

  console.log(deploySeries); // remove log

  useEffect(() => {
    searchDeployMetrics({ period: periodFilterItems[0].value });
  }, [searchDeployMetrics]);

  const [filter, setFilter] = useState<ReleaseHistoryRequest>({
    period: periodFilterItems[0].value,
    circles: []
  });

  const onSubmit = () => {
    const { circles, period } = getValues();
    const circleIds = normalizeCircleParams(circles);
    setFilter({ period, circles: circleIds });
    searchDeployMetrics({ period, circles: circleIds });
  };

  return (
    <Styled.Content data-testid="metrics-deploy">
      <Styled.Card width="531px" height="79px">
        <Styled.FilterForm
          onSubmit={handleSubmit(onSubmit)}
          data-testid="metrics-filter"
        >
          <Styled.SingleSelect
            label="Select a timestamp"
            name="period"
            options={periodFilterItems}
            control={control}
            defaultValue={periodFilterItems[0]}
          />
          <CircleFilter control={control} setValue={setValue} />
          <Styled.Button
            type="submit"
            size="EXTRA_SMALL"
            isLoading={loading}
            data-testid="metrics-deploy-apply"
          >
            <Text.h5 weight="bold" align="center" color="light">
              Apply
            </Text.h5>
          </Styled.Button>
        </Styled.FilterForm>
      </Styled.Card>

      <Styled.Plates>
        <Styled.Card width="175px" height="94px">
          <Text.h4 color="dark">Deploy</Text.h4>
          <Text.h1 color="light">
            {loading ? <Loader.Card /> : response?.successfulDeployments}
          </Text.h1>
        </Styled.Card>
        <Styled.Card width="175px" height="94px">
          <Text.h4 color="dark">Error</Text.h4>
          <Text.h1 color="light">
            {loading ? <Loader.Card /> : response?.failedDeployments}
          </Text.h1>
        </Styled.Card>
        <Styled.Card width="175px" height="94px">
          <Text.h4 color="dark">Average time</Text.h4>
          <Text.h1 color="light">
            {loading ? (
              <Loader.Card />
            ) : (
              humanizeDateFromSeconds(
                response?.successfulDeploymentsAverageTime
              )
            )}
          </Text.h1>
        </Styled.Card>
      </Styled.Plates>
      <Styled.Card width="1220px" height="521px" data-testid="apexchart-deploy">
        <Styled.ChartHeader>
          <Styled.ChartTitle>
            <Text.h2 color="light" weight="bold">
              Deploy
            </Text.h2>
            <Text.h6 color="dark">One Week</Text.h6>
            <ChartMenu onReset={() => console.log('reset')} />
          </Styled.ChartTitle>
          <Styled.ChartLengend>
            <Styled.Dot status="deploy" />
            <Text.h5 color="dark">Deployed</Text.h5>
            <Styled.Dot status="error" />
            <Text.h5 color="dark">Error</Text.h5>
            <Styled.Dot status="averageTime" />
            <Text.h5 color="dark">Avarege Time</Text.h5>
          </Styled.ChartLengend>
        </Styled.ChartHeader>
        <Chart
          width={1180}
          height={425}
          chartType="ComboChart"
          loader={<div>Loading Chart</div>}
          data={deploySeries}
          options={deployOptions}
          rootProps={{ 'data-testid': '1' }}
        />
      </Styled.Card>
      <ReleasesHistoryComponent filter={filter} />
    </Styled.Content>
  );
};

export default Deploys;
