sudo apt install chromium-chromedriver
sudo apt-get install python3-venv
python3 -m venv venv
source venv/bin/activate
pip install selenium
cd ../selenium_tests
python main.py
