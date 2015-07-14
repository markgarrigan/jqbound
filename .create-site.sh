NGINX_ALL_VHOSTS='/etc/nginx/sites-available'
NGINX_ENABLED_VHOSTS='/etc/nginx/sites-enabled'
WEB_DIR='/vagrant/public'
SED=`which sed`
NGINX=`sudo which nginx`

CONFIG=$NGINX_ALL_VHOSTS/$1
sudo cp /vagrant/.nginx-default.template $CONFIG
sudo rm $NGINX_ENABLED_VHOSTS/default

sudo $NGINX -t
if [ $? -eq 0 ];then
  sudo ln -s $CONFIG $NGINX_ENABLED_VHOSTS/$1
else
	echo "Could not create default site. There appears to be a problem with the default nginx config file.";
	exit 1;
fi

sudo /etc/init.d/nginx reload

echo "Site created: $1"
exit 0;
