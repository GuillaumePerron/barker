while [ 1 ]
do
    cd /home/ubuntu/flask_squelette
    git fetch > /dev/null
    output_git=$(git status -uno)
    output_ps=$(ps -a)
    if [[ $output_git == *"behind"* || $output_ps != *"python"* ]]
    then 
        screen -X -S server quit
        git reset --hard
        git pull
        sudo pip install -r requirements.txt 
        screen -S server -d -m sudo python server.py
    fi
    sleep 5
done

