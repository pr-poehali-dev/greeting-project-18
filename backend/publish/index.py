import json
import os
import random
import string
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Публикация сайтов с генерацией уникального домена
    Args: event - dict с httpMethod, body (html, css, js коды)
          context - object с request_id
    Returns: HTTP response с доменом опубликованного сайта
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        html_code = body_data.get('html', '')
        css_code = body_data.get('css', '')
        js_code = body_data.get('js', '')
        
        domain = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        
        database_url = os.environ.get('DATABASE_URL')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO sites (domain, html_code, css_code, js_code) VALUES (%s, %s, %s, %s) RETURNING domain",
            (domain, html_code, css_code, js_code)
        )
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'domain': domain,
                'url': f'https://plutsites.example.com/{domain}'
            })
        }
    
    if method == 'GET':
        query_params = event.get('queryStringParameters', {})
        domain = query_params.get('domain', '')
        
        if not domain:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Domain parameter required'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        cur.execute(
            "SELECT html_code, css_code, js_code FROM sites WHERE domain = %s",
            (domain,)
        )
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        if not result:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Site not found'})
            }
        
        html_code, css_code, js_code = result
        
        full_html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>{css_code}</style>
</head>
<body>
    {html_code}
    <script>{js_code}</script>
</body>
</html>"""
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': full_html
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }