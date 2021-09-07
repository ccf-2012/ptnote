#!/bin/bash
for i in {1..5}
do
	cm=$(curl -d 'username=...用户名...&bonusgift=...10000...&message=enjoy&option=13' -H 'Cookie:...COOKIE...'   "https://pterclub.com/mybonus.php?action=exchange")
	ret=$(echo $cm)
	result=$(echo $ret | grep "你成功赠送了猫粮。")
	if [[ "$result" != "" ]];then
	    echo "赠送猫粮 失败"
	else
            echo "赠送猫粮 成功"
	fi
done
