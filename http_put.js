import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export default function (){
    const res = http.put('https://reqres.in/api/users/2');
    const payload = JSON.stringify({
        name:"morpheus",
        job:"zion resident"
    });
    const params ={
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const checkOutput = check(
        res,
        {
            'response code was 200': (res) => res.status == 200,
        },
    
    );
    http.put(res,payload,params,checkOutput);
}

export const options = {
    scenarios: {
        shared_iter_scenario: {
            executor: 'shared-iterations',
            vus: 1000,
            iterations: 3500,
            startTime: '0s',
        },

    },

    thresholds: {
        'http_req_failed': ['rate<0.01'],
        'http_req_duration': ['p(95)<200'],
    }
};

