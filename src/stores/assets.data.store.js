import axios from "axios";
import { makeAutoObservable } from "mobx";

const apiUrl = "http://localhost:3000/api";


class assetsDataStore {
    data = null;
    loading = true;
    spans = [1, 7, 30, 180];
    platforms = ['uniswapv2'];

    constructor() {
        this.data = {};
        this.loading = true;
        const urls = [];
        for (let i = 0; i < this.platforms.length; i++) {
            for (let j = 0; j < this.spans.length; j++) {
                urls.push(`${apiUrl}/getprecomputeddata?platform=${this.platforms[i]}&span=${this.spans[j]}`);
            }
        }
        this.sendParallelRequests(urls)
            .then(data => {
                for(let i = 0; i < data.length; i++){
                    const url = new URL(data[i].request.responseURL);
                    const span = url.searchParams.get('span');
                    const platform = url.searchParams.get('platform');
                    if(!this.data[platform]){
                        this.data[platform] = {}
                    };
                    this.data[platform][span] = data[i].data;
                }
                this.loading = false;
            })
            .catch(error => {
                console.error('error', error);
            });
        makeAutoObservable(this);
    }
    async sendParallelRequests(urls) {
        const requests = urls.map(url => axios.get(url)); // Create an array of requests
        const data = await axios.all(requests); // Wait for all requests to complete
        return data;
    }
}

export default new assetsDataStore()