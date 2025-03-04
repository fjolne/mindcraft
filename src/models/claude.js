import Anthropic from '@anthropic-ai/sdk';
import { strictFormat } from '../utils/text.js';
import { getKey } from '../utils/keys.js';

export class Claude {
    constructor(model_name, url, params) {
        this.model_name = model_name;
        this.params = params || {};

        let config = {};
        if (url)
            config.baseURL = url;
        
        config.apiKey = getKey('ANTHROPIC_API_KEY');

        this.anthropic = new Anthropic(config);
    }

    async sendRequest(turns, systemMessage) {
        const messages = strictFormat(turns);
        let res = null;
        try {
            console.log('Awaiting anthropic api response...')
            if (!this.params.max_tokens) {
                this.params.max_tokens = 4096;
            }
            const resp = await this.anthropic.messages.create({
                model: this.model_name || "claude-3-sonnet-20240229",
                system: systemMessage,
                messages: messages,
                ...(this.params || {})
            });

            console.log('Received.')
            res = resp.content[0].text;
        }
        catch (err) {
            console.log(err);
            res = 'My brain disconnected, try again.';
        }
        return res;
    }

    async embed(text) {
        throw new Error('Embeddings are not supported by Claude.');
    }
}



