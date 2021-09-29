sshpass  -p $1 ssh -o StrictHostKeyChecking=no -i ./ssh/JAS_Demo_Box.pem ubuntu@34.236.220.116 <<-'ENDSSH'
   sudo docker login -u giorgiebanoidze -p rootnoone registry.gitlab.com
   sudo docker stop jas-web
   sudo docker rm jas-web
   sudo docker rmi registry.gitlab.com/jasgitlab/jas-web -f
   sudo docker pull registry.gitlab.com/jasgitlab/jas-web
   sudo docker run --name jas-web -d -p 443:443 -p 80:80 registry.gitlab.com/jasgitlab/jas-web
ENDSSH
