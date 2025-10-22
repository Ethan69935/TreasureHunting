import { defineStore } from 'pinia';
import { useUserStore } from '@/stores/userStore';

export const useGameStore = defineStore('game', {
  state: () => ({
    gameState: {
      gold: 0,
      helpers: 0,
      hasClue: false,
      hasTreasure: false,
  completedScenes: [], // 已完成的场景
  // 兼容旧组件：可按场景名访问，如 sceneCompleted.village
  sceneCompleted: {}
    }
  ,
  // 场景操作日志
  logs: []
  }),
  
  // 计算属性：对外暴露可访问的场景列表，用于 HomeView 渲染
  getters: {
    accessibleScenes(state) {
      const scenes = [
        { id: 'village', name: 'Village' },
        { id: 'library', name: 'Library' },
        { id: 'tavern', name: 'Tavern' },
        { id: 'temple', name: 'Temple' },
    // cave 场景已移除
        { id: 'treasureRoom', name: 'Treasure Room' },
        { id: 'exit', name: 'Exit' }
      ];
      return scenes.map(scene => ({
        id: scene.id,
        name: scene.name,
        completed: state.gameState.completedScenes.includes(scene.id)
      }));
    }
  },

  actions: {
    // 初始化游戏（从本地存储加载）
    initGame() {
      const userStore = useUserStore();
      const savedState = localStorage.getItem(`gameState_${userStore.username}`);
      if (savedState) {
        this.gameState = JSON.parse(savedState);
        // 如果存储里有 completedScenes 而没有 sceneCompleted，生成兼容对象
        if (!this.gameState.sceneCompleted) {
          this.gameState.sceneCompleted = {};
          (this.gameState.completedScenes || []).forEach(id => {
            this.gameState.sceneCompleted[id] = true;
          });
        }
        // 如果没有 logs，尝试从单独的存储读取
        try {
          const logsStr = localStorage.getItem(`gameLogs_${userStore.username}`);
          if (logsStr && !this.logs.length) this.logs = JSON.parse(logsStr);
        } catch (e) {
          // ignore
        }
      } else {
        // 新游戏初始状态
        this.gameState = {
          gold: 50, // 初始金币（调整为50）
          helpers: 1, // 初始帮手
          hasClue: false,
          hasTreasure: false,
          completedScenes: []
        };
    this.saveGame(); // 保存初始状态
      }
    },

    // 保存游戏状态
    saveGame() {
      const userStore = useUserStore();
      localStorage.setItem(`gameState_${userStore.username}`, JSON.stringify(this.gameState));
      // 同时保存日志（避免重载时丢失）
      try {
        localStorage.setItem(`gameLogs_${userStore.username}`, JSON.stringify(this.logs || []));
      } catch (e) {
        console.error('保存日志失败', e);
      }
    },

    // 重置游戏（关键新增方法）
    resetGame() {
      const userStore = useUserStore();
      // 清除本地存储的游戏数据
      localStorage.removeItem(`gameState_${userStore.username}`);
      localStorage.removeItem(`gameLogs_${userStore.username}`);
      // 重新初始化（回到新游戏状态）
      this.initGame();
    },

    // 在村庄探索（将 sceneCompleted 和 completedScenes 都标记）
    exploreVillage() {
      if (this.gameState.sceneCompleted && this.gameState.sceneCompleted.village) {
        this.logs.unshift({ time: new Date().toLocaleString(), message: '你已经探索过村庄了。' });
        this.saveGame();
        return { success: false, message: '已探索' };
      }

      // 标记已完成
      this.gameState.sceneCompleted = this.gameState.sceneCompleted || {};
      this.gameState.sceneCompleted.village = true;
      if (!this.gameState.completedScenes.includes('village')) {
        this.gameState.completedScenes.push('village');
      }
      // 奖励或改变状态（示例：增加金币）
  this.gameState.gold = (this.gameState.gold || 0) + 10;
  this.logs.unshift({ time: new Date().toLocaleString(), message: '你在村庄发现了一张破旧的地图并获得10金币！' });
      this.saveGame();
      return { success: true, message: '探索完成' };
    },

    // 探索神庙（需要线索和至少1名帮手）
    exploreTemple() {
      if (!this.gameState.hasClue) {
        this.logs.unshift({ time: new Date().toLocaleString(), message: '没有藏宝图，无法进入神庙。' });
        this.saveGame();
        return { success: false, message: '缺少线索' };
      }
      if ((this.gameState.helpers || 0) < 1) {
        this.logs.unshift({ time: new Date().toLocaleString(), message: '帮手不足，无法进入神庙。' });
        this.saveGame();
        return { success: false, message: '帮手不足' };
      }

      if (this.gameState.sceneCompleted && this.gameState.sceneCompleted.temple) {
        this.logs.unshift({ time: new Date().toLocaleString(), message: '你已探索过神庙。' });
        this.saveGame();
        return { success: false, message: '已探索' };
      }

      // 消耗一个帮手作为代价
      this.gameState.helpers = Math.max(0, (this.gameState.helpers || 0) - 1);
  // 探索神庙可获得钥匙，允许进入洞穴
  this.gameState.hasKey = true;
      this.gameState.hasTreasure = true;
      this.gameState.sceneCompleted = this.gameState.sceneCompleted || {};
      this.gameState.sceneCompleted.temple = true;
      if (!this.gameState.completedScenes.includes('temple')) this.gameState.completedScenes.push('temple');
      this.logs.unshift({ time: new Date().toLocaleString(), message: '你在神庙里找到了珍贵的宝藏！' });
      this.saveGame();
      return { success: true, message: '获得宝藏' };
    },

    // 在酒馆雇佣帮手：花费20金币，增加帮手数量
    hireHelper() {
      const cost = 20;
      if ((this.gameState.gold || 0) < cost) {
        this.logs.unshift({ time: new Date().toLocaleString(), message: '金币不足，无法雇佣帮手。', type: 'warning' });
        this.saveGame();
        return { success: false, message: '金币不足' };
      }
      this.gameState.gold = (this.gameState.gold || 0) - cost;
      this.gameState.helpers = (this.gameState.helpers || 0) + 1;
      this.logs.unshift({ time: new Date().toLocaleString(), message: `雇佣了1名帮手，花费${cost}金币。`, type: 'success' });
      this.saveGame();
      return { success: true, message: '雇佣成功' };
    },

    // 在宝藏密室寻找宝藏（需要至少3名帮手）
    findTreasure() {
      if ((this.gameState.helpers || 0) < 3) {
        this.logs.unshift({ time: new Date().toLocaleString(), message: '帮手不足，无法安全获取宝藏。', type: 'warning' });
        this.saveGame();
        return { success: false, message: '帮手不足' };
      }
      if (this.gameState.sceneCompleted && this.gameState.sceneCompleted.treasureRoom) {
        this.logs.unshift({ time: new Date().toLocaleString(), message: '宝藏已被找到。' });
        this.saveGame();
        return { success: false, message: '已找到' };
      }

      // 消耗一定帮手并给金币奖励（示例奖励：30金币）
      this.gameState.helpers = Math.max(0, (this.gameState.helpers || 0) - 3);
      this.gameState.gold = (this.gameState.gold || 0) + 30;
      this.gameState.hasTreasure = true;
      this.gameState.sceneCompleted = this.gameState.sceneCompleted || {};
      this.gameState.sceneCompleted.treasureRoom = true;
      if (!this.gameState.completedScenes.includes('treasureRoom')) this.gameState.completedScenes.push('treasureRoom');
      this.logs.unshift({ time: new Date().toLocaleString(), message: '你带着帮手成功取得了宝藏，获得30金币！', type: 'success' });
      this.saveGame();
      return { success: true, message: '获得宝藏' };
    },

  // cave 场景已移除，相关逻辑被清理

    // 场景行为：在图书馆翻阅古籍
    searchBooks() {
      // 如果已经找到线索，记录并返回
      if (this.gameState.hasClue) {
        this.logs.unshift({ time: new Date().toLocaleString(), message: '你已经找到了图书馆里的线索。' });
        this.saveGame();
        return { success: false, message: '已找到线索' };
      }

      // 找到线索
      this.gameState.hasClue = true;
      if (!this.gameState.completedScenes.includes('library')) {
        this.gameState.completedScenes.push('library');
      }
      this.logs.unshift({ time: new Date().toLocaleString(), message: '你在古籍中找到了前往神庙的线索！' });
      this.saveGame();
      return { success: true, message: '获得线索' };
    },

    // 添加日志的通用接口
    addLog(message, type = 'info') {
      this.logs.unshift({ time: new Date().toLocaleString(), message, type });
      this.saveGame();
    },

    // 完成游戏（结算分数/设置完成标记并保存）
    completeGame() {
      this.gameState.gameCompleted = true;
      // 计算简单分数：金币 + 已完成场景数 * 10
      this.gameState.score = (this.gameState.gold || 0) + (this.gameState.completedScenes.length || 0) * 10;
      this.addLog('冒险已完成，分数已结算。', 'success');
      this.saveGame();
      return { success: true };
    },

    // ... 其他原有方法（如添加金币、雇佣帮手等） ...
  }
});