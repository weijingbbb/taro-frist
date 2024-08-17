const express = require('express')
const router = express.Router()
const sqlQuery = require("../mysql")


const imgLists = [
  "https://images3.c-ctrip.com/ztrip/flightbanner/student_authentication/%25E6%259C%25BA%25E7%25A5%25A8%25E9%25A6%2596%25E9%25A1%25B5a3x.png",
  "https://images3.c-ctrip.com/ztrip/flightbanner/yaoxinyouli/app%25E9%25A6%2596%25E9%25A1%25B5.png"
]

const createTable = async () => {
  console.log('创建表---广告');
  try {
    // 创建表
    const createTablesql = `
  create table if not exists ads (
    id int auto_increment,
    imgUrl char(255) not null,
    primary key (id)
  ) engine=innodb;
  `;
    await sqlQuery(createTablesql)
    for (let i = 0; i < imgLists.length; i++) {
      const insertSgl = `insert into ads(id, imgUrl) values(null, '${imgLists[i]}')`;
      await sqlQuery(insertSgl)
    }
  }catch(err) {
    console.log('出错了。。。',err);
  }
}

createTable()

router.get("/advertising", async (req, res) => {
  console.log('访问了广告路由---advertising');
  const strSql = `select * from ads`;
  try {
    const result = await sqlQuery(strSql);
    res.send({
      code: 1,
      message: '请求成功',
      result,
    })
  } catch (err) {
    res.send({
      code: -1,
      message: '失败'
    })
  }
})

module.exports = router
