setup:
	sudo apt-get update && sudo apt-get upgrade
	sudo apt-get install -y build-essential cmake pkg-config
	sudo apt-get install -y libjpeg-dev libtiff5-dev libjasper-dev libpng-dev
	sudo apt-get install -y libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
	sudo apt-get install -y libxvidcore-dev libx264-dev
	sudo apt-get install -y libfontconfig1-dev libcairo2-dev
	sudo apt-get install -y libgdk-pixbuf2.0-dev libpango1.0-dev
	sudo apt-get install -y libgtk2.0-dev libgtk-3-dev
	sudo apt-get install -y libatlas-base-dev gfortran
	sudo apt-get install -y libhdf5-dev libhdf5-serial-dev libhdf5-103
	sudo apt-get install -y libqtgui4 libqtwebkit4 libqt4-test python3-pyqt5
	sudo apt-get install -y python3-dev

install:
	( \
	python3 -m venv .venv; \
	. .venv/bin/activate; \
	pip3 install -r requirements.txt; \
	)

run:
	( \
	. .venv/bin/activate; \
	export PYTHONPATH=$(shell pwd); \
	export GOOGLE_APPLICATION_CREDENTIALS=/home/pi/Documents/Projects/garbage-detector-app/resources/keys/storage.json; \
	python3 garbage_detector/main.py; \
	)

tfserving_run:
	docker run -p 8500:8501 --mount type=bind,source=/home/mariusz/tf2,target=/models/gd -e MODEL_NAME=gd -t tensorflow/serving
