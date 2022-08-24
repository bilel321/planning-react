import toast from "react-hot-toast";
import { ProgressBar } from 'primereact/progressbar';

function renderJob(data) {
    let cnt = (
        <div>
            <div>{data.title}</div>
            {data.description !== null && <div className="text-sm">{data.description}</div>}
            {data.percent && <div>
                <ProgressBar value={data.percent} />
            </div>}
        </div>
    );
    if (data.status == 'done') {
        toast.success(
            cnt, {
            id: 'job.' + data.id,
            duration: 2000,
        });
        return;
    }
    if (data.status == 'error') {
        toast.error(
            cnt, {
            id: 'job.' + data.id,
            duration: 5000,
        });
        return;
    }
    toast.loading(
        cnt, {
        id: 'job.' + data.id,
        duration: Infinity,
    });
};

window.addEventListener('diggow.msg', function (event) {    
    let data = event && event.detail && event.detail.data;
    if (data && data.type == 'job') renderJob(data);
});
