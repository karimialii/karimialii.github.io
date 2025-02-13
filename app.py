from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def get_google_scholar_citations(user_id):
    url = f"https://scholar.google.com/citations?user={user_id}"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the total citation count (usually in the first `td.gsc_rsb_std`)
    citations = soup.find_all("td", class_="gsc_rsb_std")
    
    if citations:
        return citations[0].text  # Total citations
    else:
        return "Not found"

@app.route('/citations', methods=['GET'])
def citations():
    user_id = "nRRz0EwAAAAJ"  # Your Google Scholar User ID
    total_citations = get_google_scholar_citations(user_id)
    return jsonify({"total_citations": total_citations})

if __name__ == '__main__':
    app.run(debug=True)
