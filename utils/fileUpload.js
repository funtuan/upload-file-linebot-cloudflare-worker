import cheerio from 'cheerio';

export const uploadibon = async (filename, buffer) => {
  console.log('uploadibon', filename, buffer);
  try {
    const res1 = await fetch('https://www.ibon.com.tw/mobile/printscan/D0111_fileupload_innerifrm.aspx');
    const body1 = await res1.text();
    const $ = cheerio.load(body1);
    const __VIEWSTATE = $('#__VIEWSTATE').val();
    const __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: new FormData({
        'fuFile': {
          value: buffer,
          options: {
            filename,
            contentType: 'application/pdf'
          }
        },
        '__VIEWSTATE': __VIEWSTATE,
        '__EVENTVALIDATION': __EVENTVALIDATION,
        'txtUserName': 'Son',
        'chkboxAgree': 'on',
        'lnkbtnUpload': '確認上傳',
        'txtEmail': 'sonLineBot@gmail.com',
      })
    }
    const res2 = await fetch('https://www.ibon.com.tw/mobile/printscan/D0111_fileupload_innerifrm.aspx', options);
    const body2 = await res2.text();
    const res3 = await fetch('https://www.ibon.com.tw/mobile/printscan/D0111_fileupload_info.aspx');
    const body3 = await res3.text();
    const $2 = cheerio.load(body3);
    const data = {
      id: $('td span.valignmiddle').text().trim(),
      qrcode: $('#imgQRCode').attr('src').replace(/..\/../, "https://www.ibon.com.tw"),
    }
    console.log(data.id);
    console.log(data.qrcode);
    return data;
  } catch (error) {
    console.log('uploadibon error', error);
    throw new Error('上傳失敗');
  }
}

export const uploadFami = async (filename, buffer) => {

  // 友善 cookie
  const friendlyCookie = 'ASP.NET_SessionId=jdtcjuj4fy0povejfriendls';
  console.log('uploadFami', filename, buffer);
  try {
    console.log('start fetch res1');
    const res1 = await fetch(
      'https://www.famiport.com.tw/Web_Famiport/Page/cloudprint.aspx',
      {
        headers: {
          'Cookie': friendlyCookie,
        },
      },
    );
    console.log('end fetch res1');
    const body1 = await res1.text();
    const $ = cheerio.load(body1);
    const __VIEWSTATE = $('#__VIEWSTATE').val();
    const __EVENTVALIDATION = $('#__EVENTVALIDATION').val();
    const __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();

    const formDataRaw = {
      '__VIEWSTATE': __VIEWSTATE,
      '__EVENTVALIDATION': __EVENTVALIDATION,
      '__VIEWSTATEGENERATOR': __VIEWSTATEGENERATOR,
      'ctl00$ContentPlaceHolder1$CKbox': 'on',
      'ctl00$ContentPlaceHolder1$txtEmail': 'lineBot@gmail.com',
      'ctl00$ContentPlaceHolder1$btnSave': '確定上傳',
    }
    const form = new FormData()
    for (const key in formDataRaw) {
      form.append(key, formDataRaw[key])
    }

    const file = new File([buffer], filename, {type: "application/pdf"});
    form.append('ctl00$ContentPlaceHolder1$FileLoad', file);

    const options = {
      method: 'post',
      body: form,
      // 使用 cookie
      headers: {
        'Cookie': friendlyCookie,
      },
    }
    // console.log form source
    console.log('start fetch res2');
    const res2 = await fetch(
      'https://www.famiport.com.tw/Web_Famiport/Page/cloudprint.aspx',
      options
    );
    console.log('end fetch res2');
    const body2 = await res2.text();
    console.log('start fetch res3')
    const res3 = await fetch(
      'https://www.famiport.com.tw/Web_Famiport/Page/cloudprint_ok.aspx',
      {
        headers: {
          'Cookie': friendlyCookie,
        },
      },
    );
    console.log('end fetch res3')
    const body3 = await res3.text();
    const $3 = cheerio.load(body3);
    const data = {
      id: $3('#ContentPlaceHolder1_LabPINCODE').text().trim(),
      qrcode: '',
    }
    if (data.id != '') data.qrcode = $3('#ContentPlaceHolder1_QRimg').attr('src').replace(/../, "https://www.famiport.com.tw/Web_Famiport");
    return data;
  } catch (error) {
    console.log('uploadFami error', error);
    throw new Error('上傳失敗');
  }
}
