
class LineMessage {
  constructor(env) {
    console.log('LineMessage', env)
    this.channelSecret = env.LINE_CHANNEL_SECRET;
    this.channelAccessToken = env.LINE_CHANNEL_ACCESS_TOKEN;
  }

  async verifySignature(
    signature, 
    body,
  ) {
    const encoder = new TextEncoder();
    const data = encoder.encode(body);
    const key = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.channelSecret),
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['sign']
    );

    const result = await window.crypto.subtle.sign('HMAC', key, data);
    return btoa(String.fromCharCode(...new Uint8Array(result))) === signature;
  }

  async replyMessage (
    replyToken, 
    text,
    messages,
  ) {
    const url = 'https://api.line.me/v2/bot/message/reply';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.channelAccessToken}`,
    };
    const data = {
      replyToken,
      messages: messages ? messages : [
        {
          type: 'text',
          text,
        },
      ],
    };
  
    try {
      await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log('replyMessage error', error);
    }
  }

  // Get content return blob
  async getContent (
    messageId,
  ) {
    console.log('getContent', messageId)
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    const headers = {
      Authorization: `Bearer ${this.channelAccessToken}`,
    };
    const res = await fetch(url, {
      method: 'GET',
      headers,
    });
    return res.arrayBuffer()
  }
}

export default LineMessage;