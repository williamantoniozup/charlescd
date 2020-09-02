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

import { useState, useEffect, useCallback } from 'react';
import {
  useFetch,
  FetchStatus,
  useFetchData,
  useFetchStatus
} from 'core/providers/base/hooks';
import { login, loginStart, circleMatcher } from 'core/providers/auth';
import { saveSessionData } from 'core/utils/auth';
import { saveCircleId } from 'core/utils/circle';
import { CIRCLE_UNMATCHED } from './Form/constants';
import { useUser } from 'modules/Users/hooks';
import { saveProfile } from 'core/utils/profile';
import { assignTo } from 'core/utils/routes';

interface CircleMatcherResponse {
  circles: {
    id: string;
  }[];
}

export const useCircleMatcher = (): {
  getCircleId: Function;
  loading: boolean;
} => {
  const [, , getCircleMatcher] = useFetch<CircleMatcherResponse>(circleMatcher);
  const [loading, setLoading] = useState(null);

  const getCircleId = useCallback(
    async (data: unknown) => {
      setLoading(true);
      try {
        const response = await getCircleMatcher(data);
        if (response) {
          const [circle] = response?.circles;
          saveCircleId(circle?.id);
        }
      } catch (e) {
        saveCircleId(CIRCLE_UNMATCHED);
        setLoading(false);
      }
    },
    [getCircleMatcher]
  );

  return {
    getCircleId,
    loading
  };
};

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export const useLogin = (): {
  doLogin: Function;
  status: FetchStatus;
  error: string;
} => {
  const getSession = useFetchData<AuthResponse>(login);
  const status = useFetchStatus();
  const { getCircleId } = useCircleMatcher();
  const [profile, , getUserByEmail] = useUser();
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      const profileBase64 = btoa(JSON.stringify(profile));
      saveProfile(profileBase64);
      status.resolved();
    }
  }, [profile]);

  const doLogin = async (email: string, password: string) => {
    status.pending();

    try {
      const response: AuthResponse = await getSession(email, password);
      saveSessionData(response['access_token'], response['refresh_token']);
      await getCircleId({ username: email });
      getUserByEmail(email);

      status.resolved();
    } catch (e) {
      const errorMessage = e.message || `${e.status}: ${e.statusText}`;
      setError(errorMessage);

      status.rejected();
    }
  };

  return {
    doLogin,
    status,
    error
  };
};

export const useAuth = (): {
  doAuth: Function;
  status: FetchStatus;
  error: string;
} => {
  const startSession = useFetchData<AuthResponse>(loginStart);
  const { getCircleId } = useCircleMatcher();
  const status = useFetchStatus();
  const [error, setError] = useState('');

  const doAuth = async (email: string) => {
    try {
      status.pending();
      const response: AuthResponse = await startSession(email);
      saveSessionData(response['access_token'], response['refresh_token']);
      await getCircleId({ username: email });

      // if (response['redirect']) {
      console.log('TODO: Redirect to Livepass');
      // assignTo('');
      // }

      status.resolved();

      return response;
    } catch (e) {
      const errorMessage = e.message || `${e.status}: ${e.statusText}`;
      setError(errorMessage);

      status.rejected();
    }
  };

  return {
    doAuth,
    status,
    error
  };
};
