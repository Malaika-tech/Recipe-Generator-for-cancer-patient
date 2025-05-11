import logging
import time
from functools import wraps
from typing import Callable
import psutil
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/recipe_service.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('recipe_service')

def log_request(func: Callable):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        
        # Log request
        logger.info(f"Request started: {func.__name__}", extra={
            'function': func.__name__,
            'args': args,
            'kwargs': kwargs
        })
        
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start_time
            
            # Log successful response
            logger.info(f"Request completed: {func.__name__}", extra={
                'function': func.__name__,
                'duration': f"{duration:.2f}s",
                'status': 'success'
            })
            
            return result
        except Exception as e:
            duration = time.time() - start_time
            
            # Log error
            logger.error(f"Request failed: {func.__name__}", extra={
                'function': func.__name__,
                'duration': f"{duration:.2f}s",
                'error': str(e),
                'status': 'error'
            })
            
            raise
    
    return wrapper

def get_health_status():
    """Get system health metrics"""
    process = psutil.Process(os.getpid())
    
    health = {
        'status': 'UP',
        'timestamp': time.time(),
        'uptime': time.time() - process.create_time(),
        'memory': {
            'rss': process.memory_info().rss,
            'vms': process.memory_info().vms
        },
        'cpu': {
            'percent': process.cpu_percent(),
            'count': psutil.cpu_count()
        }
    }
    
    logger.info("Health check", extra=health)
    return health 