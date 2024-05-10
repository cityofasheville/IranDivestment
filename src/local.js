
import {handler} from './index.js';
let event = {
  "local": true
};
handler(event).then((res) => {
    console.log(res);
});

