"use strict";
// review.ts
Page({
    data: {
        rating: 5,
        ratingDesc: '非常满意',
        comment: '',
        currentTrip: {
            date: '2025-09-19 14:30',
            startAddress: '北京市朝阳区三里屯SOHO',
            endAddress: '北京市海淀区中关村大厦',
            price: '28.5',
            driver: {
                name: '张师傅',
                avatar: '👨‍💼',
                carModel: '大众朗逸',
                plateNumber: '京A12345'
            }
        },
        tags: [
            { id: 1, text: '服务态度好', selected: false },
            { id: 2, text: '车内整洁', selected: false },
            { id: 3, text: '驾驶平稳', selected: false },
            { id: 4, text: '准时到达', selected: true },
            { id: 5, text: '路线熟悉', selected: false },
            { id: 6, text: '沟通顺畅', selected: false }
        ],
        historyReviews: [
            {
                id: 1,
                date: '2025-09-18',
                rating: 5,
                comment: '师傅服务很好，车很干净，驾驶平稳，推荐！',
                route: '王府井 → 三里屯'
            },
            {
                id: 2,
                date: '2025-09-15',
                rating: 4,
                comment: '总体不错，就是路上有点堵车。',
                route: '机场 → 酒店'
            },
            {
                id: 3,
                date: '2025-09-12',
                rating: 5,
                comment: '非常满意，师傅人很好，会再次选择。',
                route: '公司 → 地铁站'
            }
        ]
    },
    onLoad() {
        console.log('评价页面加载');
    },
    getRatingDesc() {
        const descriptions = ['', '很不满意', '不满意', '一般', '满意', '非常满意'];
        return descriptions[this.data.rating] || '请评分';
    },
    setRating(e) {
        const rating = parseInt(e.currentTarget.dataset.rating);
        const descriptions = ['', '很不满意', '不满意', '一般', '满意', '非常满意'];
        this.setData({
            rating: rating,
            ratingDesc: descriptions[rating] || '请评分'
        });
    },
    toggleTag(e) {
        const tagId = e.currentTarget.dataset.id;
        const tags = this.data.tags.map(tag => {
            if (tag.id === tagId) {
                return { ...tag, selected: !tag.selected };
            }
            return tag;
        });
        this.setData({
            tags
        });
    },
    onCommentInput(e) {
        this.setData({
            comment: e.detail.value
        });
    },
    submitReview() {
        const selectedTags = this.data.tags.filter(tag => tag.selected).map(tag => tag.text);
        const reviewData = {
            rating: this.data.rating,
            tags: selectedTags,
            comment: this.data.comment.trim(),
            tripId: 'trip_' + Date.now()
        };
        wx.showLoading({
            title: '提交中...'
        });
        // 模拟提交请求
        setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
                title: '评价提交成功',
                icon: 'success'
            });
            // 重置表单
            this.setData({
                rating: 5,
                ratingDesc: '非常满意',
                comment: '',
                tags: this.data.tags.map(tag => ({ ...tag, selected: false }))
            });
            // 添加到历史记录
            const newReview = {
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                rating: reviewData.rating,
                comment: reviewData.comment || '无评价内容',
                route: `${this.data.currentTrip.startAddress.split('市')[1]?.split('区')[0] || '起点'} → ${this.data.currentTrip.endAddress.split('市')[1]?.split('区')[0] || '终点'}`
            };
            this.setData({
                historyReviews: [newReview, ...this.data.historyReviews]
            });
        }, 1500);
    }
});
