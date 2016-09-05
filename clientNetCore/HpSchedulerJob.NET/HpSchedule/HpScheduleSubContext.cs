namespace HpSchedulerJob.NET.HpSchedule
{
    public class HpScheduleSubContext
    {
        public HpScheduleContext context { get; internal set; }


        internal decimal progress_multi { get; set; }

        internal decimal progress_base { get; set; }

        internal decimal progress_multi_parent { get; set; }

        internal decimal progress_base_parent { get; set; }

        internal decimal progress_multi_only { get; set; }

        internal decimal progress_base_only { get; set; }



        internal HpScheduleSubContext(HpScheduleContext context, int progress_max)
        {
            this.context = context;
            this.progress = 0;

            decimal progress_width = (decimal)(progress_max - context.progress);

            this.progress_multi_only = progress_width / 100;
            this.progress_multi_parent = 1;
            this.progress_base_only = context.progress == null ? 0 : context.progress.Value;
            this.progress_base_parent = 0;

            this.progress_multi = this.progress_multi_parent * this.progress_multi_only;
            this.progress_base = this.progress_base_only * this.progress_multi_parent;
        }

        internal HpScheduleSubContext(HpScheduleSubContext subContext, int progress_max)
        {
            this.context = subContext.context;
            this.progress = 0;

            decimal progress_width = (decimal)(progress_max - subContext.progress);

            this.progress_multi_only = progress_width / 100;
            this.progress_multi_parent = subContext.progress_multi;
            this.progress_base_only = subContext.progress == null ? 0 : subContext.progress.Value;
            this.progress_base_parent = subContext.progress_base;

            this.progress_multi = this.progress_multi_parent * this.progress_multi_only;
            this.progress_base = subContext.progress_base + this.progress_base_only * this.progress_multi_parent;
        }

        public string param
        {
            get
            {
                return this.context.param;
            }
        }

        public string taskid
        {
            get
            {
                return this.context.taskid;
            }
        }

        public int? progress { get; internal set; }

        public bool Log(string message, int? _progress = null)
        {
            if (_progress != null)
            {
                this.progress = _progress;
                _progress = (int)(_progress * this.progress_multi + this.progress_base);
            }

            return this.context.Log(message, _progress);
        }

        public void createSubJob(int stage, SubJob job)
        {
            if (stage <= this.progress)
            {
                throw new System.Exception("stage small than progress");
            }

            if (stage > 100) stage = 100;

            job(new HpScheduleSubContext(this, stage));
        }
    }
}
