
import axios from "axios";
// const APIURL = 'https://api.optigoapps.com/storev26/store.aspx';
// const APIURL = 'http://zen/api/ReactStore.aspx'
// const APIURL = (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/storev26/ReactStore.aspx';
const APIURL = (window.location.hostname === 'localhost'
    || window.location.hostname === 'zen'
    || window.location.hostname === 'fgstore.web'
    || window.location.hostname === 'fgstore.mapp'
    || window.location.hostname === 'fgstorepro.mapp'
    || window.location.hostname === 'fgstore.pro'
    || window.location.hostname === 'fgstore.plw'
    || window.location.hostname === 'malakan.web'
    || window.location.hostname === 'rpjewel.web'
    
    || window.location.hostname === 'hdstore.web'
    || window.location.hostname === 'hdstore.mapp'
    || window.location.hostname === 'hdstore.pro'
    || window.location.hostname === 'hdstore.plw'
    || window.location.hostname === 'stamford.web'
    || window.location.hostname === 'mddesignworld.web'

    || window.location.hostname === 'elvee.web'
    || window.location.hostname === 'diamondtine.web'
    || window.location.hostname === 'forevery.web'
    || window.location.hostname === 'hoq.web') ? 'http://zen/api/razorpay.aspx' : 'https://api.optigoapps.com/ReactStore/razorpay.aspx';
    // || window.location.hostname === 'hoq.web') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/test/ReactStore.aspx';

// const APIURL = 'https://api.optigoapps.com/test/store.aspx';
// const NEWAPIURL = 'https://api.optigoapps.com/storev26/ReactStore.aspx';
// const ZENURL = 'http://zen/api/store.aspx'


export const CommonAPIForRazorPay = async (body) => {
    const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
    try {
        const YearCode = storeInit?.YearCode ?? '' ;
        const version = storeInit?.version  ?? '';
        const token = storeInit?.token ?? '';
        const sv = storeInit?.sv ?? '';

        const header = {
            Authorization: `Bearer ${token}`,
            Yearcode: YearCode,
            // Version: version,
            // sp: "1",
            sv: 0
        };
        const response = await axios.post(APIURL, body, { headers: header });
        return response?.data;

    } catch (error) {
        console.error('error is..', error);
    }
};

