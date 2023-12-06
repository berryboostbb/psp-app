export const receipt_data = data => {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <div style="background: #fff; width: 400px; border: 1px solid #ccc; margin: 0 auto; margin-top: 0px; margin-top: 30px; padding: 15px; font-family: helvetica, arial, sans-serif">
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                ${data.header_1 &&
        `<div style="text-align: center;width:50px;margin:0 auto;">
                    <img style="height:50px;width:100%;object-fit: cover;display: block;" src="${data.header_1}" alt="${data.header_2}">
                </div>`
        }
                ${data.header_2 && `<div style="text-align: center">${data.header_2}</div>`}
                ${data.header_3 && `<div style="text-align: center">${data.header_3}</div>`}
                ${data.header_4 && `<div style="text-align: center">${data.header_4}</div>`}
                ${data.header_5 && `<div style="text-align: center">${data.header_5}</div>`}
                ${data.header_6 && `<div style="text-align: center">${data.header_6}</div>`}
            </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Merchant ID:</div>
                <div style="float: right">${data?.merchant_id}</div>
            </div>

            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Terminal ID:</div>
                <div style="float: right">${data?.terminal_id}</div>
            </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Clerk ID:</div>
                <div style="float: right">${data?.clerk_id}</div>
            </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Date: ${data?.d}</div>
                <div style="float: right">Time: ${data?.t}</div>
            </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Batch# ${data?.batch_number}</div>
                <div style="float: right">Transaction# ${data?.transaction_no}</div>
            </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Invoice# </div>
                <div style="float: right">${data?.invoice_number}</div>
            </div>
                    
          
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px;  font-weight: bold; font-size: large;">
                <div style="text-align: center">Sale</div>
            </div>

            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">${data?.card_type}</div>
                <div style="float: right">${data?.card_number}</div>
            </div>
            
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
            <div style="float: left">Entry Method</div>
        
             <div style="float: right">${data?.entry_mode}</div>
            
        
            </div>

            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Account Type:</div>
                <div style="float: right">DEFAULT</div>
            </div>

            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Ref.#:</div>
                <div style="float: right">${data.ref_number}</div>
            </div>

            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Trace ID:</div>
                <div style="float: right">${data?.trace_id}</div>
            </div>

            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Auth.#:</div>
                <div style="float: right">${data?.auth_id}</div>
            </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
            <div style="float: left">Amount:</div>
            <div style="float: right">${data?.sale_amount}</div>
            </div>
            ${data?.tip_amount
            ? ` <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                            <div style="float: left">Tip:</div>
                            <div style="float: right">${data?.tip_amount}</div>
                        </div>`
            : ''
        }


            ${data?.surcharge_amount
            ? `<div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                            <div style="float: left">Surcharge:</div>
                            <div style="float: right">${data?.surcharge_amount}</div> 
                        </div> `
            : ''
        }

           <br/>
             <hr/>
            <div style="clear: left; width: 100%">
            <div style="float: left;font-size: large;">Total:</div>
            <div style="float: right;font-size: large;">${data.totalAmount}</div>
            </div>
            <br/>
          
              
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px;">
                <div style="float: left">Application Label:</div>
                <div style="float: right">${data?.application_label}</div> 
            </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">Application Pref Name:</div>
                <div style="float: right">${data?.application_pref_name}</div> 
            </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">AID:</div>
                <div style="float: right">XXXXXXXXXXXXXXX</div> </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">TVR:</div>
                <div style="float: right">XXXXXXXXXXXX</div> </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="float: left">TSI:</div>
                <div style="float: right">XXXXXXXX</div> </div>
        
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
                <div style="height: 10px" ></div>
            </div>
            <div style="clear: left; width: 100%; line-height: 20px; padding: 5px">
            ${data?.pin_status
            ? `
                    <div style="font-size: 1rem; text-align: center">${data?.pin_status?.toUpperCase()}</div>
                `
            : `
                    <div style="font-size: 1rem; text-align: center">00-APPROVED-001</div>
                `
        }
            <div style="text-align: center">Merchant Copy</div>
            ${data.footer_1 && `<div style="text-align: center">${data.footer_1}</div>`}
            ${data.footer_2 && `<div style="text-align: center">${data.footer_2}</div>`}
            ${data.footer_3 && `<div style="text-align: center">${data.footer_3}</div>`}
            ${data.footer_4 && `<div style="text-align: center">${data.footer_4}</div>`}
            ${data.footer_5 && `<div style="text-align: center">${data.footer_5}</div>`}
            ${data.footer_6 && `<div style="text-align: center">${data.footer_6}</div>`}
            </div>
            
          
        
        </div>
    </body>
</html>`;
};

