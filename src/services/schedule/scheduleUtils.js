const Blog = require("../../models/blog");
const Schedule = require("../../models/schedule");

const updateSchedule = async (id) => {

    try {
        const schedule = await Schedule.findByPk(id);

        if (!schedule) return;

        const isPublish = publishPost(schedule.blogId)

        if (isPublish && !isPublish.ok) await schedule.update({ status: 'fail' });

        await schedule.update({ status: 'inactive' });
        return;
    } catch (error) {
        console.log(error)
    }
}

const publishPost = async (id) => {
    try {
        const blog = await Blog.findByPk(id);
        if (!blog) return { ok: false, msg: 'Error' };
        const updatedBlog = await blog.update({ status: 'published' });
        if (!updatedBlog) return { ok: false, msg: 'Error' };

        return { ok: true, msg: 'Success' };
    } catch (error) {
        return { ok: false, msg: error };
    }


}

module.exports = { updateSchedule }