import { useEffect, useMemo, useState } from "react";

interface Project {
    id: number;
    title: string;
    description: string;
    permalink: string;
    cover: {
        small_square_url: string;
        micro_square_image_url: string;
        thumb_url: string;
    };
}

interface ArtstationData {
    data: Project[];
    total_count: number;
}

export default function Artstation() {
    const [data, setData] = useState<ArtstationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = 'https://www.artstation.com/users/niektempert/projects.json?page=1';

    useEffect(() => {
        fetch(proxyUrl + encodeURIComponent(targetUrl))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const getCovers = useMemo(() => {
        if (!data || !data.data) return [];
        
        return data.data.map(project => ({
            id: project.id,
            title: project.title,
            thumbUrl: project.cover.thumb_url,
            permalink: project.permalink
        }));
    }, [data]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>ArtStation Projects</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {getCovers.map(project => (
                    <div key={project.id}>
                        <a href={project.permalink} target="_blank" rel="noopener noreferrer">
                            <img 
                                src={project.thumbUrl}
                                alt={project.title}
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                            <h3>{project.title}</h3>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}