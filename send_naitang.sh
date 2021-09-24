for i in {1..5}
do
    # ...用户名...替换为你要送的用户username 
    # ...COOKIE...替换为你白兔站上的Cookie
    cm=$(curl -d 'username=...用户名...&bonusgift=10000&message=enjoy&option=7' -H 'Cookie:...COOKIE...'   "https://pterclub.com/mybonus.php?action=exchange")
    ret=$(echo $cm)
    result=$(echo $ret | grep "你成功赠送了奶糖。")
    if [[ "$result" != "" ]];then
        echo "赠送奶糖 失败"
    else
        echo "赠送奶糖 成功"
    fi
done