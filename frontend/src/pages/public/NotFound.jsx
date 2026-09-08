import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/Layout';
import { Button } from '../../components/Common';
import SEO from '../../components/SEO';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <SEO 
        title="404 - Page Not Found" 
        description="The page you are looking for does not exist."
      />
      <Container className="text-center space-y-8">
        <div className="relative inline-block">
          <h1 className="text-[10rem] sm:text-[15rem] font-bold text-muru-pink/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-4xl font-bold text-muru-text-main">Oops!</span>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-muru-text-main">Page Not Found</h2>
          <p className="text-muru-text-secondary leading-relaxed">
            The skincare secrets you're looking for might have been moved or doesn't exist anymore.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/">
            <Button variant="primary" className="flex items-center gap-2 px-8 py-3">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muru-text-secondary hover:text-muru-pink transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
