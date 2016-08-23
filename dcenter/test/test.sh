####################################
# 触发器管理
####################################

# 触发器列表
curl http://localhost:9001/triggers

# 新建触发器
curl -H "Content-Type: application/json" -X POST -d '{"name": "轮询间隔5分钟触发","code": "AXV0B1A5","stime": 1422342342343,"etime": 1422348342343,"repeat": 0,"type": 0,"value": "300"}' http://localhost:9001/triggers

# 触发器详情
curl http://localhost:9001/triggers/1

# 修改触发器
curl -H "Content-Type: application/json" -X PUT -d '{"name": "轮询间隔5分钟触发","code": "AXV0B1A5","stime": 1422888882343,"etime": 1422999992343,"repeat": 0,"type": 0,"value": "300"}' http://localhost:9001/triggers/1

# 触发器详情(标识)
curl http://localhost:9001/triggers/code/AXV0B1A5

# 删除触发器
curl -X DELETE http://localhost:9001/triggers/1






####################################
# 任务管理
####################################

# 任务列表
curl http://localhost:9001/tasks

# 新建任务
curl -H "Content-Type: application/json" -X POST -d '{"name": "5分钟未付款订单自动取消","detail": "5分钟未付款订单自动取消","trigger_code": "AXV031A4","param": "123","type": 0,"target": "order_auto_cancel"}' http://localhost:9001/tasks

# 任务详情
curl http://localhost:9001/tasks/1

# 修改任务
curl -H "Content-Type: application/json" -X PUT -d '{"name": "5分钟未付款订单自动取消","detail": "5分钟未付款订单自动取消","trigger_code": "AXV031A4","param": "555","type": 0,"target": "order_auto_cancel"}' http://localhost:9001/tasks/1

# 删除任务
curl -X DELETE http://localhost:9001/tasks/1
