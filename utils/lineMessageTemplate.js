
// 上傳檔案選單
export const uploadFileMenu = ({
  fileName,
  fileSize,
  fileMessageId,
}) => {
  const mbSize = (fileSize / 1024 / 1024).toFixed(2);
  const uploadFamiActionData = {
    type: 'uploadFami',
    fileName,
    fileSize,
    fileMessageId,
  };

  return {
    // flex message
    type: 'flex',
    altText: '選擇超商',
    contents: {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "選擇上傳超商",
            "weight": "bold",
            "size": "xl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "lg",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "名稱",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": fileName,
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 5
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "大小",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": `${mbSize} MB`,
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 5
                  }
                ]
              }
            ]
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "postback",
              "label": "全家列印",
              "text": "全家檔案上傳中\n過程需要2~3分鐘，請稍等",
              "data": JSON.stringify(uploadFamiActionData),
            }
          },
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "message",
              "label": "711列印",
              "text": "尚未支援711超商列印"
            }
          }
        ],
        "flex": 0
      }
    },
  }
}

// 全家取件畫面
export const famiPickupMenu = ({
  id, // 取件號碼
  qrcodeUrl,
  fileName,
  fileSize,
}) => {
  const mbSize = (fileSize / 1024 / 1024).toFixed(2);
  return {
    // flex message
    type: 'flex',
    altText: '前往全家取件列印',
    contents: {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
          {
            "type": "text",
            "wrap": true,
            "weight": "bold",
            "gravity": "center",
            "size": "xl",
            "text": `列印號碼：${id}`
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "lg",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "名稱",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": fileName,
                    "wrap": true,
                    "size": "sm",
                    "color": "#666666",
                    "flex": 4
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "大小",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": `${mbSize} MB`,
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 4
                  }
                ]
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "xxl",
            "contents": [
              {
                "type": "image",
                "url": qrcodeUrl,
                "aspectMode": "cover",
                "size": "5xl",
                "margin": "md"
              },
              {
                "type": "text",
                "text": "請攜帶「列印號碼 or QR Code  掃描」至全台全家店舖 FamiPort 進行文件下載，上傳超過72小時，文件將會自動刪除。",
                "color": "#aaaaaa",
                "wrap": true,
                "margin": "xxl",
                "size": "xs"
              }
            ]
          }
        ]
      }
    }
  }
}