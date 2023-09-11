
import { Router } from 'itty-router';
import LineMessage from './utils/lineMessage';
import {
	uploadFileMenu,
	famiPickupMenu,
} from './utils/lineMessageTemplate';
import {
	uploadibon,
	uploadFami,
} from './utils/fileUpload';


// Create a new router
const router = Router();


// 接收 line message webhook
router.post('/webhook', async (request, env) => {
	const lineMessage = new LineMessage(env);

	const signature = request.headers.get('x-line-signature');
	const body = await request.text();

	if (!lineMessage.verifySignature(signature, body)) {
		return new Response('Signature validation failed.', { status: 401 });
	}

	const events = JSON.parse(body).events;
	console.log('events', JSON.stringify(events, null, 2));

	for (const event of events) {
		await env.LINEBOT_EVENT_QUEUE.send(event);
	}

	return new Response('ok', { status: 200 });
})

// 處理 line event
async function handleLineEvent(event, env) {
	const lineMessage = new LineMessage(env);
	const { type, replyToken } = event;

	if (type === 'message' && event.message.type === 'text') {
		const { text } = event.message;

		if (!text.includes('上傳')) {
			return lineMessage.replyMessage(replyToken, '請直接分享檔案給我');
		}
	}

	// 如果為檔案
	if (type === 'message' && event.message.type === 'file') {
		const { id } = event.message;

		const messages = [
			uploadFileMenu({
				fileName: event.message.fileName,
				fileSize: event.message.fileSize,
				fileMessageId: id,
			}),
		];

		return lineMessage.replyMessage(replyToken, null, messages);
	}
	if (type === 'postback') {
		const { data } = event.postback;
		const {
			type,
			fileName,
			fileSize,
			fileMessageId,
		} = JSON.parse(data);

		if (type === 'uploadFami') {
			const key = `task-uploadFami-${fileMessageId}`;

			// 避免重複上傳
			const taskRecord = await env.RECORD.get(key);
			if (taskRecord === 'uploading') {
				return lineMessage.replyMessage(replyToken, '檔案上傳中請稍候');
			}
			if (taskRecord && taskRecord.includes('"id"')) {
				const data = JSON.parse(taskRecord);
				return lineMessage.replyMessage(replyToken, null, [famiPickupMenu(data)]);
			}

			try {
				await addUploadCount(event.source.userId, env);
			} catch (error) {
				return lineMessage.replyMessage(replyToken, error.message);
			}

			await env.RECORD.put(key, 'uploading', { expirationTtl: 60 * 5 });

			const buffer = await lineMessage.getContent(fileMessageId);

			const result = await uploadFami(fileName, buffer);
			console.log('result', JSON.stringify(result, null, 2));

			const data = {
				id: result.id,
				qrcodeUrl: result.qrcode,
				fileName,
				fileSize,
			}
			await env.RECORD.put(
				key, 
				JSON.stringify(data), 
				{ expirationTtl: 60 * 60 * 24 },
			);

			return lineMessage.replyMessage(replyToken, null, [famiPickupMenu(data)]);
		}
	}
}

// 嘗試增加個人一天上傳次數
async function addUploadCount(userId, env) {
	const key = `uploadCount-${userId}`;
	const count = Number(await env.RECORD.get(key)) || 0;
	if (count >= 20) {
		throw new Error('今日上傳次數已達上限');
	}
	await env.RECORD.put(key, count + 1, { expirationTtl: 60 * 60 * 24 });
}

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch: router.handle,
  async queue(batch, env) {
    // MessageBatch has a `queue` property we can switch on
    switch (batch.queue) {
      case 'upload-file-linebot':
				await Promise.all(batch.messages.map(async msg => {
					await handleLineEvent(msg.body, env)
					msg.ack();
				}));
				break;
      default:
      // Handle messages we haven't mentioned explicitly (write a log, push to a DLQ)
    }
  },
};
