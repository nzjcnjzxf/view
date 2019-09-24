module.exports = (function () {
    return {
        /**口语名词的接口分为两类 一类是个人的，一类是专科和全院的 */
        olarRouter: {
            person: {
                // 新增的个人
                add: "/word/addPersonal",
                // 口语列表个人
                queryPage: "/word/queryPagePersonal",
                // 删除个人
                del: "/word/delPersonal",
                // 更新的个人
                update: "/word/updatePersonal",
                // 导入文件
                importFile: "/word/importFilePersonal",
                // 导出文件
                exportFile: "/word/exportFilePersonal"
            },
            other: {
                // 新增口语
                add: "/word/add",
                // 口语列表
                queryPage: "/word/queryPage",
                // 删除口语
                del: "/word/del",
                // 更新口语
                update: "/word/update",
                // 导入文件
                importFile: "/word/importFile",
                // 导出文件
                exportFile: "/word/exportFile"
            },

        },
        smartRouter: {
            // 获取前十个推荐码
            queryAiCode: "/smart/queryAiCode",
            // 获取疾病第一条记录
            queryDisTopOne: "/smart/queryDisTopOne",
            // 图像查询
            queryDiseasesPicture: "/smart/queryDiseasesPicture",
            // 获取历史记录
            queryHistory: "/smart/queryHistory",
            // 智慧查询疾病代码
            querySmartCode: "/smart/querySmartCode",
            // 口语名词智慧查询代码
            querySmartWordCode: "/smart/querySmartWordCode",
        },
        userRouter: {
            // 添加后台管理员
            addSysUser: "/user/addSysUser",
            // 移除管理员权限
            changeUserRole: "/user/changeUserRole",
            // 用户搜索
            queryOrgUser: "/user/queryOrgUser",
            // 注册、登录、新增管理员
            register: "/user/register",
            // 获取系统管理员列表
            queryPage: "/user/queryPage",
            // 删除系统管理员
            del: "/user/del",
            // 获取科室信息
            queryCenterInfo: "/user/queryCenterInfo"
        },
        codeRouter: {
            // 添加个人常用代码
            add: "/comCode/add",
            // 删除个人常用代码
            del: "/comCode/del",
            // 获取个人常用代码集合
            queryPage: "/comCode/queryPage"
        },
        // 服务地址
        // baseUrl: location.protocol + '//' + location.host
        baseUrl: 'https://10.50.130.86'
    };
})();