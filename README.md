# 说明

hp-scheduler 分布式任务调度系统，通过MQ实现任务下发及任务执行进度和日志反馈，以实现对异构语言和跨平台的支持。

hp-scheduler 使用RabbitMQ作为消息传递手段，只要支持RabbitMQ的语言和平台，即可作为任务执行单元（见下述 - 任务执行单元）


# 系统组成

hp-scheduler 由 1 + 1 + N 组成，即1个调度中心 + 1个管理控制台 + N个任务执行单元。

### 调度中心

调度中心有几个职责，一是对管理控制台提供管理配置接口和监控日志接口；二是内部实现触发器任务调度（目前触发器仅支持普通时间间隔和cron表达式）。
调度中心对相同MQ、参数的任务，

### 管理控制台

配置管理触发器，配置管理任务（配置关联触发器），查看任务执行记录，查看任务日志

### 任务执行单元

接收调度中心发起的任务，执行并反馈执行进度和日志。hp-scheduler采用RabbitMQ工作队列模型的公平调度原则，在消息消费端采用noAck:false确保消息不被丢失。

# 功能特性
> - 定时任务
> - 任务执行记录
> - 任务日志
> - 多语言、跨平台

# TODO List
> - 触发器支持配置最大次数
> - 支持任务的并发和串行控制
> - 控制台操作日志
> - 监控节点健康状态（通知调度中心的心跳-60）
> - 任务支持禁用与启用
> - 停止正在执行的任务
> - 任务支持断点执行
> - 任务类型除支持现有MQ方式外，增加RESTful支持（任务URL可配置多个）
> - 设置监控报警、任务负责人
> - 调度中心支持集群

# 安装

### 系统依赖

1. nodeJS
> 调度中心: 运行环境依赖   
> 管理控制台: 编译环境依赖

2. rabbitmq
> hp-scheduler使用rabbitmq作为mq中间件

3. mysql 
> 调度中心使用mysql存储数据信息: 触发器数、任务、任务记录、任务日志

```
git clone https://github.com/alfredking12/hp-scheduler.git
```

### 安装和配置 调度中心

```

# mysql创建数据库
mysql> create database scheduler; 

# 安装 nodemon
npm install -g nodemon --verbose

# 安装依赖
cd hp-scheduler/dcenter
npm install --verbose

# 配置

var config = {
    # mysql连接串
    db_connection_string: "mysql://dev:" + encodeURIComponent('Bysun4321$#@!') + "@dev.mysql.local:3306/scheduler",
    # mysql连接池最大连接数
    db_pool_max: 2,
    # mysql连接池最小连接数
    db_pool_min: 0,
    # mysql连接池连接空闲时间
    db_pool_idle: 10000,

    # rabbitmq uri
    rabbitmq_url: 'amqp://mquser:Bysun@dev.rabbitmq.local:5672',

    # 监听任务执行单元日志和进度的 rabbitmq.routingKey
    dispatcher_center_callback: '__dispatcher_center_callback.local',

    # 分页查询数据最大条数
    max_page_size: 200,
    
    # 是否输出sql日志
    log_sql: false,
    
    # 日志格式: true为简单格式，false为完整日志
    log_simpleformat: true
}

# 启动node服务(推荐用pm2管理node服务)
# 可通过设置环境变量PORT设置服务启动时监听的端口，默认为9001
#   windows: set PORT=8080
#   linux: export PORT=8080
npm start

```

### 安装和配置 管理控制台

```

# 安装依赖
cd hp-scheduler/console
npm install --verbose

# 配置
var config = {
    # 调度中心：HOST + PORT
    api_server: 'http://localhost:9001',
}

import _config from './config.dev'; config = _config;
//import _config from './config.sit'; config = _config;
//import _config from './config.pre'; config = _config;
//import _config from './config.prd'; config = _config;

export default config;

# 打包编译
npm run build

# 发布, 将hp-scheduler/console/build中的文件发布到web服务器

```

### 开发任务执行单元

```
# 1. 新建控制台项目

# 2. 通过nuget安装HpSchedulerJob.NET

# 3. 编码

public class Demo : HpScheduleJob
{
    public Demo(string rabbitmq_url, string jobKey) : base(rabbitmq_url, jobKey)
    {
    }

    public override void Execute(HpScheduleContext context)
    {
        context.Log("开始", 0);
        context.Log("第一步完成", 30);
        context.Log("第二步完成", 60);
        context.Log("调试信息输出");
        context.Log("结束", 100);

    }

    protected override string getJobName()
    {
        return "demo_" + this.GetHashCode();
    }
}

class Program
{
    static void Main(string[] args)
    {
        JobApplication app = new JobApplication(new HpScheduleOptions()
        {
            //日志输出样式
            Debug = true,
            //log4net配置文件路径
            Log4net = AppUtil.GetPath() + "\\..\\..\\log4net.config",
            //配置文件config.json的路径, 设定后可通过ConfigurationCenter.getValue取值
            Config = AppUtil.GetPath() + "\\..\\..\\config.json"
        });

        // 任务执行过程中发送日志和进度到调度中心的 rabbitmq.routingKey
        var dispatcher_center_callback = ConfigurationCenter.getValue("dispatcher_center_callback");

        // 任务MQ key
        var jobKey = "demo";

        // 启动服务
        app.start(dispatcher_center_callback, 
            new Demo(ConfigurationCenter.getValue("rabbitmq_url"), jobKey)
            );

        Console.ReadLine();
        
        // 服务停止
        app.stop();
    }
}

```

### 创建一个定时任务

1. 打开管理控制台, 创建一个触发器

2. 复制触发器标识, 点击左上角菜单按钮创建一个任务，并粘贴触发器标识，设置任务MQ key。(demo) 

ps: 目前每次更新触发器，都会使触发器重置。

```
TODO: 配图
```





