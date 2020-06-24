import { useState, useCallback } from "react"
import { request } from "../api";
import { saveCookie } from "../utils/cookie";

export const useIdentify = () => {
  const [status, setStatus] = useState('idle');

  const getCircleID = useCallback(async (payload) => {
    try {
      setStatus('pending');
      const data = {
        workspaceId: 'a435bd12-ae82-48c8-b164-066d91ffe3a5',
        requestData: payload
      };
      const response = await request(
        '/charlescd-circle-matcher/identify',
        { method: 'POST', data }
      );
      const [{ id }] = response.data.circles;
      saveCookie('x-circle-id', id);
      setStatus('resolved');

    } catch (e) {
      saveCookie('x-circle-id', 'UNMATCHED');
      setStatus('rejected');
      console.error(e);
    }
  }, []);

  return {
    getCircleID,
    status
  }
}