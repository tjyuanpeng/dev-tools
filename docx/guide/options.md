# 选项

配置 sfdt 的相关功能

## 桌面通知

sfdt 支持桌面通知，当启动代理服务的时候，会通知用户代理服务已启动

## 代理端口

设置代理服务运行的端口，只支持四位数的端口号

## 代理环境

支持修改内置的代理环境设置

根据自己的需要增加/修改环境配置

### 环境配置的字段说明

|   名称 | 说明                                                                                                                                                             |
| -----: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 关键字 | 环境的唯一主键，请不要与其他环境的关键字重复<br>不支持修改已经在使用的环境配置的关键字，以防止代理规则数据错误<br>如需修改，请在代理规则中删除正在使用的环境配置 |
|   名称 | 环境配置的显示名称                                                                                                                                               |
|    URL | 环境配置的 URL 地址                                                                                                                                              |