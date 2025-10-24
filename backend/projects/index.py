import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление проектами пользователей (сохранение, загрузка, список)
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с request_id
    Returns: HTTP response с данными проектов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    headers_data = event.get('headers', {})
    user_id = headers_data.get('X-User-Id') or headers_data.get('x-user-id', 'anonymous')
    
    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        project_id = query_params.get('id')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        if project_id:
            cur.execute(
                "SELECT id, name, html_code, css_code, js_code, favicon_url, created_at, updated_at FROM projects WHERE id = %s AND user_id = %s",
                (project_id, user_id)
            )
            result = cur.fetchone()
            cur.close()
            conn.close()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Project not found'})
                }
            
            project = {
                'id': result[0],
                'name': result[1],
                'html': result[2],
                'css': result[3],
                'js': result[4],
                'favicon': result[5],
                'created_at': str(result[6]),
                'updated_at': str(result[7])
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(project)
            }
        else:
            cur.execute(
                "SELECT id, name, created_at, updated_at FROM projects WHERE user_id = %s ORDER BY updated_at DESC",
                (user_id,)
            )
            results = cur.fetchall()
            cur.close()
            conn.close()
            
            projects = [{
                'id': row[0],
                'name': row[1],
                'created_at': str(row[2]),
                'updated_at': str(row[3])
            } for row in results]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'projects': projects})
            }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        name = body_data.get('name', 'Новый проект')
        html_code = body_data.get('html', '')
        css_code = body_data.get('css', '')
        js_code = body_data.get('js', '')
        favicon_url = body_data.get('favicon', '')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO projects (name, html_code, css_code, js_code, favicon_url, user_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (name, html_code, css_code, js_code, favicon_url, user_id)
        )
        project_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'id': project_id})
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        project_id = body_data.get('id')
        name = body_data.get('name')
        html_code = body_data.get('html')
        css_code = body_data.get('css')
        js_code = body_data.get('js')
        favicon_url = body_data.get('favicon')
        
        if not project_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Project ID required'})
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        cur.execute(
            "UPDATE projects SET name = %s, html_code = %s, css_code = %s, js_code = %s, favicon_url = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s AND user_id = %s",
            (name, html_code, css_code, js_code, favicon_url, project_id, user_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True})
        }
    
    if method == 'DELETE':
        query_params = event.get('queryStringParameters') or {}
        project_id = query_params.get('id')
        
        if not project_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Project ID required'})
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        cur.execute(
            "DELETE FROM projects WHERE id = %s AND user_id = %s",
            (project_id, user_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
