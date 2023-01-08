'use strict';

/**
 * drug controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::drug.drug', ({ strapi }) => ({
    async bulkCreate(ctx) {
        const lines = ctx.request.body.data;
        for (let i = 7; i < lines.length; ++i) {
            const drug = await strapi.db.query('api::drug.drug').findOne({
                where: {
                    code: lines[i][0],
                }
            });
            if (!drug) {
                await strapi.db.query('api::drug.drug').create({
                    data: {
                        code: lines[i][0],
                        label: lines[i][1],
                        label_i: removeVietnameseTones(lines[i][1]),
                        type: lines[i][2],
                        ingredient: lines[i][4],
                        ingredient_i: removeVietnameseTones(lines[i][4]),
                        stock: parseInt(lines[i][12].split(" ")[0]),
                        unit: lines[i][12].split(" ")[1],
                        publishedAt: new Date(),
                    }
                });
            } else {
                await strapi.db.query('api::drug.drug').update({
                    where: {
                        code: lines[i][0],
                        label: lines[i][1],
                        label_i: removeVietnameseTones(lines[i][1]),
                        ingredient: lines[i][4],
                        ingredient_i: removeVietnameseTones(lines[i][4]),
                    },
                    data: {
                        stock: parseInt(lines[i][12].split(" ")[0]),
                    }
                });
            }
        }
        return {ok: true}
    },

    async deleteAll(ctx) {
        return strapi.query("api::drug.drug").deleteMany(
            {
                where: {
                    code: {
                      $startsWith: 'H',
                    },
                },
            }
        );
    }
}));


function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    return str;
  }